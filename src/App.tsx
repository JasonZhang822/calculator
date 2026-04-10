import { useState } from 'react'
import './App.css'

type ButtonType = 'func' | 'num' | 'op' | 'equal'

interface CalcButton {
  label: string
  type: ButtonType
}

const BUTTONS: CalcButton[] = [
  { label: 'C', type: 'func' },
  { label: 'DEL', type: 'func' },
  { label: '÷', type: 'op' },
  { label: '×', type: 'op' },
  { label: '7', type: 'num' },
  { label: '8', type: 'num' },
  { label: '9', type: 'num' },
  { label: '-', type: 'op' },
  { label: '4', type: 'num' },
  { label: '5', type: 'num' },
  { label: '6', type: 'num' },
  { label: '+', type: 'op' },
  { label: '1', type: 'num' },
  { label: '2', type: 'num' },
  { label: '3', type: 'num' },
  { label: '=', type: 'equal' },
  { label: '0', type: 'num' },
  { label: '.', type: 'num' },
]

const OPERATORS = ['+', '-', '×', '÷'] as const

const isOperator = (char: string) => OPERATORS.includes(char as (typeof OPERATORS)[number])

// 先乘除，后加减
const evaluateExpression = (expression: string): string => {
  const nums = expression.split(/[-+×÷]/g).map(Number)
  const ops = expression.match(/[-+×÷]/g) ?? []

  for (let i = 0; i < ops.length; i++) {
    if (ops[i] === '×' || ops[i] === '÷') {
      // 除数为 0 时直接给出提示
      if (ops[i] === '÷' && nums[i + 1] === 0) return 'Error'

      const res = ops[i] === '×' ? nums[i] * nums[i + 1] : nums[i] / nums[i + 1]
      nums.splice(i, 2, res)
      ops.splice(i, 1)
      i--
    }
  }

  let result = nums[0]
  for (let i = 0; i < ops.length; i++) {
    result = ops[i] === '+' ? result + nums[i + 1] : result - nums[i + 1]
  }

  // 避免出现 0.30000000000000004 这种情况
  return Number(result.toFixed(10)).toString()
}

function App() {
  const [display, setDisplay] = useState('0')

  const handleNumber = (label: string) => {
    const lastChar = display[display.length - 1]

    if (label === '.') {
      // 不能在运算符后直接输入小数点
      if (isOperator(lastChar)) return

      const numberParts = display.split(/[+\-×÷]/g)
      const currentPart = numberParts[numberParts.length - 1]
      if (currentPart.includes('.')) return
    }

    if (display === '0' && label !== '.') {
      setDisplay(label)
      return
    }

    setDisplay((prev) => prev + label)
  }

  const handleOperator = (label: string) => {
    const lastChar = display[display.length - 1]

    if (display === '0') return

    // 连续点运算符时，用最新运算符替换前一个
    if (isOperator(lastChar)) {
      setDisplay((prev) => prev.slice(0, -1) + label)
      return
    }

    setDisplay((prev) => prev + label)
  }

  const handleFunction = (label: string) => {
    if (label === 'C') {
      setDisplay('0')
      return
    }

    if (label === 'DEL') {
      setDisplay((prev) => (prev.length === 1 ? '0' : prev.slice(0, -1)))
    }
  }

  const handleEqual = () => {
    const lastChar = display[display.length - 1]
    if (isOperator(lastChar) || lastChar === '.') return

    setDisplay(evaluateExpression(display))
  }

  const handleClick = (button: CalcButton) => {
    if (display === 'Error' && button.label !== 'C') {
      // 错误态下只允许清空，避免状态混乱
      return
    }

    switch (button.type) {
      case 'num':
        handleNumber(button.label)
        break
      case 'op':
        handleOperator(button.label)
        break
      case 'func':
        handleFunction(button.label)
        break
      case 'equal':
        handleEqual()
        break
      default:
        break
    }
  }

  return (
    <div className="app">
      <div className="calculator">
        {/* 展示屏 */}
        <div className="display">{display}</div>

        {/* 按钮布局 */}
        <div className="buttons">
          {BUTTONS.map((button) => {
            // 特殊按钮样式
            const extraClass =
              button.label === '0' ? 'btn-zero' : button.label === '=' ? 'btn-equal' : ''

            return (
              <button
                key={button.label}
                className={`btn ${extraClass}`}
                onClick={() => handleClick(button)}
              >
                {button.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default App
