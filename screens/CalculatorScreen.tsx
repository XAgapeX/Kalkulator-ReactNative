import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, useWindowDimensions } from 'react-native';
import Mexp from 'math-expression-evaluator';
import CalcButton from '../components/CalcButton';

const scientificButtons = [
  ['(', ')', 'mc', 'm+', 'm-', 'mr', 'AC', '+/-', '%', '÷'],
  ['2nd', 'x²', 'x³', 'xʸ', 'eˣ', '10ˣ', '7', '8', '9', '×'],
  ['1/x', '√x', '³√x', 'y√x', 'ln', 'log10', '4', '5', '6', '-'],
  ['x!', 'sin', 'cos', 'tan', 'e', 'EE', '1', '2', '3', '+'],
  ['Rad', 'sinh', 'cosh', 'tanh', 'π', 'Rand', '0', '.', '='],
];

const basicButtons = [
  ['AC', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', '='],
];

export default function CalculatorScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [input, setInput] = useState<string>('0');
  const [memory, setMemory] = useState<number>(0);
  const [degMode, setDegMode] = useState<boolean>(true);
  const [secondMode, setSecondMode] = useState<boolean>(false);

  const [eeActive, setEeActive] = useState<boolean>(false);
  const [eeSignUsed, setEeSignUsed] = useState<boolean>(false);
  const [eeDigitsEntered, setEeDigitsEntered] = useState<boolean>(false);

  const clearAll = () => {
    setInput('0');
    setEeActive(false);
    setEeSignUsed(false);
    setEeDigitsEntered(false);
  };

  const isDigit = (v: string) => /^[0-9]$/.test(v);

  const getCurrentNumber = (expr: string) => {
    const lastOperatorIndex = Math.max(
      expr.lastIndexOf('+'),
      expr.lastIndexOf('-'),
      expr.lastIndexOf('*'),
      expr.lastIndexOf('/'),
      expr.lastIndexOf('(')
    );
    return expr.slice(lastOperatorIndex + 1);
  };

  const isConstant = (expr: string) =>
    expr === 'π' || expr === 'pi' || expr === String(Math.PI) || expr === 'e' || expr === String(Math.E);

  const canInsertDot = (expr: string) => {
    const current = getCurrentNumber(expr);
    return !current.includes('.');
  };

  const handlePress = (val: string) => {
    if (eeActive) {
      if (isDigit(val)) {
        setInput(prev => prev + val);
        setEeDigitsEntered(true);
      }
      return;
    }

    if (val === '.') {
      if (!canInsertDot(input)) return;
      setInput(prev => prev + '.');
      return;
    }

    setInput(prev => (prev === '0' && val !== '.' ? val : prev + val));
  };

  const handleOperator = (op: string) => {
    const map: any = { '×': '*', '÷': '/' };
    const real = map[op] || op;

    if (op === '%') {
      try {
        const x = new Mexp().eval(
          input.replace(/÷/g, '/').replace(/×/g, '*').replace(/π/g, 'pi').replace(/√/g, 'sqrt')
        );
        setInput(String(x / 100));
      } catch {
        setInput("Error");
      }
      return;
    }

    if (input === '0' && op === '-') {
      setInput('-');
      return;
    }

    if (eeActive) {
      if (!eeSignUsed && op === '-') {
        setInput(prev => prev + '-');
        setEeSignUsed(true);
        return;
      }
      if (!eeDigitsEntered) return;
      setEeActive(false);
      setEeSignUsed(false);
      setEeDigitsEntered(false);
    }

    setInput(prev => prev + op);
  };

  const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));

  const rad = (x: number) => (degMode ? (x * Math.PI) / 180 : x);

  const applySciFunction = (func: string) => {
    if (eeActive) return;

    let x = 0;
    try {
      const sanitized = input
        .replace(/÷/g, '/')
        .replace(/×/g, '*')
        .replace(/π/g, 'pi')
        .replace(/√/g, 'sqrt');

      x = new Mexp().eval(sanitized);
    } catch {
      return setInput("Error");
    }

    let result = x;

    switch (func) {
      case 'x²': result = x ** 2; break;
      case 'x³': result = x ** 3; break;
      case '√x': result = Math.sqrt(x); break;
      case '³√x': result = Math.cbrt(x); break;
      case 'eˣ': result = Math.exp(x); break;
      case '10ˣ': result = 10 ** x; break;

      case 'ln':
        if (x <= 0) return setInput("Error");
        result = Math.log(x);
        break;

      case 'log10':
        if (x <= 0) return setInput("Error");
        result = Math.log10(x);
        break;

      case 'sin': result = degMode && !isConstant(input) ? Math.sin(rad(x)) : Math.sin(x); break;
      case 'cos': result = degMode && !isConstant(input) ? Math.cos(rad(x)) : Math.cos(x); break;
      case 'tan': result = degMode && !isConstant(input) ? Math.tan(rad(x)) : Math.tan(x); break;

      case 'sinh': result = Math.sinh(x); break;
      case 'cosh': result = Math.cosh(x); break;
      case 'tanh': result = Math.tanh(x); break;

      case 'x!':
        result = x < 0 ? NaN : factorial(x);
        break;

      case '1/x':
        if (x === 0) return setInput("Error");
        result = 1 / x;
        break;

      case 'π': result = Math.PI; break;
      case 'e': result = Math.E; break;
      case 'Rand': result = Math.random(); break;

      case '2nd': setSecondMode(!secondMode); return;
      case 'Rad': setDegMode(!degMode); return;

      case 'EE':
        if (!/[0-9]$/.test(input)) return;
        const currentNumber = getCurrentNumber(input);
        if (currentNumber.includes('EE')) return;

        setInput(prev => prev + 'EE');
        setEeActive(true);
        setEeSignUsed(false);
        setEeDigitsEntered(false);
        return;

      case 'xʸ':
        setInput(prev => prev + '^');
        return;

      case 'y√x': {
        const base = getCurrentNumber(input);
        setInput(prev => prev.replace(base, `(${base})^(1/`));
        return;
      }

      default:
        return;
    }

    if (!isFinite(result) || isNaN(result)) {
      setInput("Error");
    } else {
      setInput(String(result));
    }
  };

  const canInsertClosingParen = (expr: string) => {
    const open = (expr.match(/\(/g) || []).length;
    const close = (expr.match(/\)/g) || []).length;
    if (close >= open) return false;
    const last = expr[expr.length - 1];
    if (['+', '-', '*', '/', '('].includes(last)) return false;
    return true;
  };

  const calculate = () => {
    try {
      if (eeActive && !eeDigitsEntered) {
        setInput('Error');
        setEeActive(false);
        return;
      }

      let sanitized = input
        .replace(/(\d+(?:\.\d+)?)EE(-?\d+)/g, '($1 * pow(10, $2))')
        .replace(/log10\(/g, 'log(')
        .replace(/÷/g, '/')
        .replace(/×/g, '*')
        .replace(/π/g, 'pi')
        .replace(/√/g, 'sqrt');

      const result = new Mexp().eval(sanitized);

      if (!isFinite(result) || isNaN(result)) {
        setInput("Error");
      } else {
        setInput(String(result));
      }

      setEeActive(false);
    } catch {
      setInput('Error');
      setEeActive(false);
    }
  };

  const handleMemory = (action: string) => {
    const curr = parseFloat(input);
    switch (action) {
      case 'mc': setMemory(0); break;
      case 'mr': setInput(String(memory)); break;
      case 'm+': setMemory(memory + curr); break;
      case 'm-': setMemory(memory - curr); break;
    }
  };

  const getButtonProps = (label: string) => {
    const isOperator = ['÷', '×', '-', '+', '='].includes(label);
    const isNumber = /^[0-9.]$/.test(label);
    const flex = label === '0' ? 2 : 1;

    let backgroundColor = '#A5A5A5';
    let color = '#fff';
    if (isOperator) backgroundColor = '#A8C66C';
    if (label === 'AC') backgroundColor = '#A5A5A5';

    return {
      label,
      title: label === 'Rad' ? (degMode ? 'Deg' : 'Rad') : label,
      flex,
      backgroundColor,
      color,
      onPress: () => {
          if (label === 'AC') return clearAll();
          if (['mc', 'mr', 'm+', 'm-'].includes(label)) return handleMemory(label);

          if (label === '%') return handleOperator('%');

          if (isOperator && label !== '=') return handleOperator(label);
          if (label === '=') return calculate();

          if (label === '(') {
            setInput(prev => {
              if (prev === '0') return '(';
              const last = prev[prev.length - 1];
              if (/\d|\)/.test(last)) return prev + '*(';
              return prev + '(';
            });
            return;
          }

          if (label === ')') {
            if (eeActive) return;
            return setInput(prev => (canInsertClosingParen(prev) ? prev + ')' : prev));
          }

          if (!isNumber) return applySciFunction(label);

          handlePress(label);
        },
     }
  }

  const layout = isLandscape ? scientificButtons : basicButtons;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <View style={styles.display}>
        <Text style={styles.displayText}>{input}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        {layout.map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map(label => {
              const props = getButtonProps(label);
              return (
                <CalcButton
                  key={label}
                  title={props.title}
                  flex={props.flex}
                  backgroundColor={props.backgroundColor}
                  color={props.color}
                  borderColor="#000"
                  onPress={props.onPress}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  display: {
    flex: 3,
    backgroundColor: '#1C1C1C',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 10,
    paddingBottom: 20,
  },
  buttonsContainer: { flex: 7 },
  displayText: { fontSize: 50, color: '#fff' },
  row: { flexDirection: 'row', flex: 1 },
});
