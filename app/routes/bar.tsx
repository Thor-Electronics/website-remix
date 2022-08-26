import { json, type LoaderFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"

export const loader: LoaderFunction = async () => {
  console.log("Resolving bar")
  await new Promise(resolve => setTimeout(resolve, 500))
  return json({ n: Math.random() })
}

export default function Bar() {
  const data = useLoaderData()
  return (
    <div className="bar">
      <h1 className="text-4xl">Bar</h1>
      <p className="text-4xl">{data.n}</p>
      <Link to="/foo">FOO</Link>
      <p className="">---</p>
      <Link to="/">HOME</Link>
    </div>
  )
}
