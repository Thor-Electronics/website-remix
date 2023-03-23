export interface Area {
  id: string
  name: string
  parentId: string
  parent?: Area
  children: Area[]
}
