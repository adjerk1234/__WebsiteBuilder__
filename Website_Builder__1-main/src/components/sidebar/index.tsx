import { getAuthUserDetails } from '@/lib/queries'
import { off } from 'process'
import React from 'react'
import MenuOptions from './menu-options'

type Props = {
  id: string
  type: 'agency' | 'subaccount'
}

const Sidebar = async ({ id, type }: Props) => {
  const user = await getAuthUserDetails()
  if (!user) return null

  if (!user.agency) return

  const details =
    type === 'agency'
      ? user?.agency
      : user?.agency.subAccount.find((subaccount) => subaccount.id === id)

  const isWhiteLabeledAgency = user.agency.whiteLabel
  if (!details) return

  let sideBarLogo = user.agency.agencyLogo || '/assets/plura-logo.svg'

  if (!isWhiteLabeledAgency) {
    if (type === 'subaccount') {
      sideBarLogo =
        user?.agency.subAccount.find((subaccount) => subaccount.id === id)
          ?.subAccountLogo || user.agency.agencyLogo
    }
  }

  const sidebarOpt =
    type === 'agency'
      ? user.agency.sidebarOption || []
      : user.agency.subAccount.find((subaccount) => subaccount.id === id)
          ?.sidebarOption || []

  const subaccounts = user.agency.subAccount.filter((subaccount) =>
    user.permissions.find(
      (permission) =>
        permission.subAccountId === subaccount.id && permission.access
    )
  )

  return (
    <>
      <MenuOptions
        defaultOpen={true}
        details={details}
        id={id}
        sidebarLogo={sideBarLogo}
        sidebarOpt={sidebarOpt}
        subAccounts={subaccounts}
        user={user}
      />
      <MenuOptions
        details={details}
        id={id}
        sidebarLogo={sideBarLogo}
        sidebarOpt={sidebarOpt}
        subAccounts={subaccounts}
        user={user}
      />
    </>
  )
}

export default Sidebar
