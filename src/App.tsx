import { Calculator } from './components/Calculator'

function App() {
  return (
    <div className="flex min-h-screen w-full justify-center overflow-x-hidden bg-gray-50">
      <div className="mx-auto w-full min-w-0 max-w-[480px] px-4">
        <Calculator />
      </div>
    </div>
  )
}

export default App
