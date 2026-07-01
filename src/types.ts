<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> d2f90cedf1ae15b6a4be2def582eb7f514bb1e43
// El id ahora es el _id que asigna MongoDB (string), ya no un correlativo numérico
// propio de tablas relacionales.
export interface Product {
  id: string
<<<<<<< HEAD
=======
=======
export interface Product {
  id: number
>>>>>>> origin/main
>>>>>>> d2f90cedf1ae15b6a4be2def582eb7f514bb1e43
  name: string
  category: string
  stock: number
  price: number
  sold: number
}

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> d2f90cedf1ae15b6a4be2def582eb7f514bb1e43
export interface Category {
  id: string
  name: string
}

<<<<<<< HEAD
=======
=======
>>>>>>> origin/main
>>>>>>> d2f90cedf1ae15b6a4be2def582eb7f514bb1e43
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
