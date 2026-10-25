import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { DietaryPreferenceSummary } from '../dietary-preference-summary'
import { renderWithRouter } from '../../test-helpers/render-with-router'

describe('DietaryPreferenceSummary', () => {
  it('shows two tags and the count of the remaining preferences', async () => {
    renderWithRouter(
      <DietaryPreferenceSummary labels={['Gluten Free', 'Dairy Free', 'Nut Free', 'Vegan']} />,
    )

    await screen.findByText('Gluten Free')
    expect(screen.getByText('Gluten Free')).toBeInTheDocument()
    expect(screen.getByText('Dairy Free')).toBeInTheDocument()
    expect(screen.getByText('+2')).toBeInTheDocument()
    expect(screen.queryByText('Nut Free')).not.toBeInTheDocument()
  })

  it('shows every preference in a tooltip on hover', async () => {
    const user = userEvent.setup()
    renderWithRouter(
      <DietaryPreferenceSummary labels={['Gluten Free', 'Dairy Free', 'Nut Free', 'Vegan']} />,
    )

    await user.hover(await screen.findByText('+2'))

    expect(await screen.findByRole('tooltip')).toHaveTextContent(
      'Gluten Free, Dairy Free, Nut Free, Vegan',
    )
  })

  it('shows every preference in a tooltip on keyboard focus', async () => {
    const user = userEvent.setup()
    renderWithRouter(
      <DietaryPreferenceSummary labels={['Gluten Free', 'Dairy Free', 'Nut Free', 'Vegan']} />,
    )

    await screen.findByText('+2')
    await user.tab()

    expect(await screen.findByRole('tooltip')).toHaveTextContent(
      'Gluten Free, Dairy Free, Nut Free, Vegan',
    )
  })
})
