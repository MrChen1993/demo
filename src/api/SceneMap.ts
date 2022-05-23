import axios from "./core";
import * as utils from "../utils"

export async function getEquipmentInFloor(floorId:String = "Fl99099900025904b47d898a4f8788b9bfe1eb41c009"){
    return axios.get('/apm-aim/aim/space-service/equipments-in-floor',{
        params:{
            floorId
        }
    })
}

interface Point{
    X:number,
    Y:number,
    Z:number
}

export interface Space{
    outline: Array<[Array<Point>,Array<Array<Point>>]>
}
export interface SpaceTree{
    children?:Array<SpaceTree>
    spaces?:Array<Space>
}
interface SpacesInFloorResp{
    spaceTreeList:Array<SpaceTree>
}
export async function getSpacesInFloor(floorId:String = "Fl99099900025904b47d898a4f8788b9bfe1eb41c009"):Promise<Array<Space>>{
    const {data:{spaceTreeList}}  = await axios.get<SpacesInFloorResp>('/apm-aim/aim/space-service/spaces-in-floor',{
        params:{
            floorId
        }
    })

    const flattenSpaceTree = utils.flatten(spaceTreeList)
    return flattenSpaceTree.flatMap(it=>it.spaces??[])
}

