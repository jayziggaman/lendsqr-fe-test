import { useEffect, useState } from "react"
import "./Loading.scss"


const Loading = () => {
  const [index, setIndex] = useState<number>(0)
  const circles = [1, 1, 1]

  useEffect(() => {
    const interval = setInterval(() => {
      if (index === (circles.length - 1)) {
        setIndex(prev => prev - prev)

      } else {
        setIndex(prev => prev + 1)
      }
    }, 500)
    
    return () => {
      clearInterval(interval)
    }
  }, [index])



  return (
    <div className="data-loading">
      {circles.map((_, ind) => {

        return (
          <span key={ind}
            className={`loading-circle ${index === ind ? 'active' : ''}`}
          ></span>
        )
      })}
    </div>
  )
}



export default Loading