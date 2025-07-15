import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid'

interface Price {
  monthly: string
  annually: string
}

interface Tier {
  id: string
  name: 'Starter' | 'Growth' | 'Scale' // Явно указываем возможные значения
  description: string
  price: Price
  highlights: string[]
  featured: boolean
}

interface TierFeature {
  Starter: boolean | string
  Growth: boolean | string
  Scale: boolean | string
}

interface Feature {
  name: string
  tiers: TierFeature
}

interface Section {
  name: string
  features: Feature[]
}

const tiers: Tier[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Everything you need to get started.',
    price: { monthly: '$19', annually: '$199' },
    highlights: ['Custom domains', 'Edge content delivery', 'Advanced analytics'],
    featured: false,
  },
  {
    id: 'scale',
    name: 'Scale',
    description: 'Added flexibility at scale.',
    price: { monthly: '$99', annually: '$999' },
    highlights: [
      'Custom domains',
      'Edge content delivery',
      'Advanced analytics',
      'Quarterly workshops',
      'Single sign-on (SSO)',
      'Priority phone support',
    ],
    featured: true,
  },
  {
    id: 'growth',
    name: 'Growth',
    description: 'All the extras for your growing team.',
    price: { monthly: '$49', annually: '$499' },
    highlights: ['Custom domains', 'Edge content delivery', 'Advanced analytics', 'Quarterly workshops'],
    featured: false,
  },
]

const sections: Section[] = [
  {
    name: 'Features',
    features: [
      { name: 'Edge content delivery', tiers: { Starter: true, Growth: true, Scale: true } },
      { name: 'Custom domains', tiers: { Starter: '1', Growth: '3', Scale: 'Unlimited' } },
      { name: 'Team members', tiers: { Starter: '3', Growth: '20', Scale: 'Unlimited' } },
      { name: 'Single sign-on (SSO)', tiers: { Starter: false, Growth: false, Scale: true } },
    ],
  },
  {
    name: 'Reporting',
    features: [
      { name: 'Advanced analytics', tiers: { Starter: true, Growth: true, Scale: true } },
      { name: 'Basic reports', tiers: { Starter: false, Growth: true, Scale: true } },
      { name: 'Professional reports', tiers: { Starter: false, Growth: false, Scale: true } },
      { name: 'Custom report builder', tiers: { Starter: false, Growth: false, Scale: true } },
    ],
  },
  {
    name: 'Support',
    features: [
      { name: '24/7 online support', tiers: { Starter: true, Growth: true, Scale: true } },
      { name: 'Quarterly workshops', tiers: { Starter: false, Growth: true, Scale: true } },
      { name: 'Priority phone support', tiers: { Starter: false, Growth: false, Scale: true } },
      { name: '1:1 onboarding tour', tiers: { Starter: false, Growth: false, Scale: true } },
    ],
  },
]

function classNames(...classes: Array<string | boolean | undefined | null>): string {
  return classes.filter(Boolean).join(' ')
}

export default function ThreeTiersWithFeatureComparison() {
  return (
    <form className="group/tiers isolate overflow-hidden">
      <div className="flow-root bg-gray-900 pt-24 pb-16 sm:pt-32 lg:pb-0">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative z-10">
            <h2 className="mx-auto max-w-4xl text-center text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              Pricing that grows with you
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-gray-300">
              Choose an affordable plan that's packed with the best features.
            </p>
            <div className="mt-16 flex justify-center">
              <fieldset className="grid grid-cols-2 gap-x-1 rounded-full bg-white/5 p-1">
                <legend className="sr-only">Payment frequency</legend>
                <label className="cursor-pointer rounded-full px-2.5 py-1 text-center text-sm font-semibold text-white">
                  <input type="radio" name="frequency" value="monthly" className="sr-only" defaultChecked />
                  <span>Monthly</span>
                </label>
                <label className="cursor-pointer rounded-full px-2.5 py-1 text-center text-sm font-semibold text-white">
                  <input type="radio" name="frequency" value="annually" className="sr-only" />
                  <span>Annually</span>
                </label>
              </fieldset>
            </div>
          </div>

          <div className="relative mx-auto mt-10 grid max-w-md grid-cols-1 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={classNames(
                  tier.featured ? 'bg-white shadow-xl ring-1 ring-gray-900/10' : 'bg-gray-800/80 ring-1 ring-white/10',
                  'relative rounded-2xl'
                )}
              >
                <div className="p-8 lg:pt-12">
                  <h3 className="text-lg font-semibold leading-8 text-white">
                    {tier.name}
                  </h3>
                  <div className="mt-4 flex items-baseline gap-x-2">
                    <span className="text-4xl font-bold tracking-tight text-white">
                      {tier.price.monthly}
                    </span>
                    <span className="text-sm font-semibold leading-6 text-gray-300">/month</span>
                  </div>
                  <p className="mt-6 text-sm leading-6 text-gray-300">{tier.description}</p>
                  <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-300">
                    {tier.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-x-3">
                        <CheckIcon className="h-5 w-5 flex-none text-white" aria-hidden="true" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Feature comparison tables */}
          {sections.map((section) => (
            <div key={section.name} className="mb-16">
              <h3 className="text-lg font-semibold leading-8 text-gray-900">{section.name}</h3>
              <div className="mt-6 overflow-hidden border-t border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="py-6 pr-6 text-left text-sm font-semibold text-gray-900">Feature</th>
                      {tiers.map((tier) => (
                        <th key={tier.id} className="px-6 py-6 text-center text-sm font-semibold text-gray-900">
                          {tier.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {section.features.map((feature) => (
                      <tr key={feature.name}>
                        <td className="py-5 pr-6 text-sm font-medium text-gray-900">{feature.name}</td>
                        {tiers.map((tier) => {
                          const value = feature.tiers[tier.name]
                          return (
                            <td key={`${feature.name}-${tier.id}`} className="px-6 py-5 text-center text-sm text-gray-500">
                              {typeof value === 'string' ? (
                                value
                              ) : value ? (
                                <CheckIcon className="mx-auto h-5 w-5 text-indigo-600" aria-hidden="true" />
                              ) : (
                                <XMarkIcon className="mx-auto h-5 w-5 text-gray-400" aria-hidden="true" />
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  )
}
