import { render, screen } from '@testing-library/react'
import ErrorPage from '../ErrorPage'

describe('ErrorPage component', () => {
  it('renders provided title and description', () => {
    render(<ErrorPage title="Oops" description="Something went wrong" />)
    expect(screen.getByTestId('error-title').textContent).toBe('Oops')
    expect(screen.getByTestId('error-description').textContent).toBe('Something went wrong')
  })
})
