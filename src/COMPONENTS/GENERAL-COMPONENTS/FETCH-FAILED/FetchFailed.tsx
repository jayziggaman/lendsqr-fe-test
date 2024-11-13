import "./FetchFailed.scss"




const FetchFailed = ({ message }: { message: string }) => {
  // Simple component that is displayed if the intial fetch for users fails
  return (
    <div className="fetch-failed">
      {message}
    </div>
  )
}


export default FetchFailed
