/**
 * Solution types for the solutions pages
 */

export interface Solution {
  slug: string
  title: string
  overview: string
  features: string[]
  details: string
  customSections?: {
    caseStudies?: string[]
    faq?: string[]
    testimonials?: string[]
  }
  tryLink?: string
}

export interface SolutionsData {
  individuals: Solution[]
  businesses: Solution[]
  governments: Solution[]
}
