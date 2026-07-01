<<<<<<< HEAD
// El id ahora es el _id que asigna MongoDB (string), ya no un correlativo numérico
// propio de tablas relacionales.
export interface Product {
  id: string
=======
export interface Product {
  id: number
>>>>>>> origin/main
  name: string
  category: string
  stock: number
  price: number
  sold: number
}

<<<<<<< HEAD
export interface Category {
  id: string
  name: string
}

=======
>>>>>>> origin/main
// Categorías iniciales de ejemplo. El usuario puede agregar, editar o eliminar
// las que quiera desde la sección "Categorías" — ya no son fijas.
export const DEFAULT_CATEGORIES = [
  'Alimentación',
  'Higiene',
  'Accesorios',
  'Salud',
  'Juguetes',
  'Transporte',
]

export function formatCLP(n: number) {
  return '$' + Number(n).toLocaleString('es-CL')
}
