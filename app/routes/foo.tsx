import { json, type LoaderFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"

export const loader: LoaderFunction = async () => {
  console.log("Resolving foo")
  await new Promise(resolve => setTimeout(resolve, 1500))
  return json({ n: Math.random() })
}

export default function Foo() {
  const data = useLoaderData()
  return (
    <div className="foo">
      <h1 className="text-4xl">Foo</h1>
      <p className="text-4xl">{data.n}</p>
      <Link to="/bar">BAR</Link>
      <p className="">---</p>
      <Link to="/">HOME</Link>
    </div>
  )
}
