export interface Product {
  id: number
  name: string
  category: string
  stock: number
  price: number
  sold: number
}

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
