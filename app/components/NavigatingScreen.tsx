import { useTransition } from "@remix-run/react"
import { useEffect, useState } from "react"

export const NavigatingScreen = () => {
  const transition = useTransition()
  const isNavigating = transition.state === "loading"
  const [isVisible, setIsVisible] = useState(false)
  const [isHiding, setIsHiding] = useState(false)
  const [state, setState] = useState("Loading ")

  useEffect(() => {
    if (isNavigating) {
      setIsHiding(false)
      setIsVisible(true)
    } else {
      setIsHiding(true)
      setTimeout(() => setIsVisible(false), 195)
    }
  }, [isNavigating])

  useEffect(() => {
    setInterval(
      () =>
        setState(prev => {
          if (prev === "Loading . . . . . ") return "Loading "
          return prev + ". "
        }),
      500
    )
  }, [])

  return isVisible ? (
    <div className={`NavigatingScreen ${isHiding ? "hide" : "show"}`}>
      <div className="logo">LOGO</div>
      {/* <p className="description">Please wait while</p> */}
      <div className="state">{state}</div>
    </div>
  ) : null
}

export default NavigatingScreen
