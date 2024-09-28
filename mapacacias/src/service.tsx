import { Places } from "./models"

export const CategoriesService = async ():Promise<string[]> => {
    const response = await fetch("https://www.datos.gov.co/resource/d856-btkz.json?$select=distinct(categoria) as categoria")
    .then(data => data.json())

    return response.map((item: { categoria: any }) => item.categoria)
}

export const PlacesCategoryService = async (categoria:string):Promise<Places[]> => {
    const response = await fetch(`https://www.datos.gov.co/resource/d856-btkz.json?categoria=${categoria}&$select=numero,nombre,horarioatencion,categoria,direccion,latitudn,longitudw,email,telefono,whatsapp`)
    .then(data => data.json()) as Places[]

    return response.filter((x) => (!isNaN(+x.latitudn) && !isNaN(+x.longitudw))).map((item:Places) => item)
}

export const PlacesDefaultService = async ():Promise<Places[]> => {
    const response = await fetch(`https://www.datos.gov.co/resource/d856-btkz.json?$select=numero,nombre,horarioatencion,categoria,direccion,latitudn,longitudw,email,telefono,whatsapp`)
    .then(data => data.json()) as Places[]

    return response.filter((x) => (!isNaN(+x.latitudn) && !isNaN(+x.longitudw))).map((item:Places) => item)
}