interface TreeNode<T>{
    children?: Array<T>
}

export function flatten<T extends TreeNode<T>>(list:Array<T>):Array<T>{
    return list.flatMap(it=>[it,...flatten(it.children??[])])
}
