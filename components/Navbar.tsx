import Link from 'next/link'
import Image from 'next/image'
import Navitems from './Nav-items'
import { Show, SignInButton, UserButton } from '@clerk/nextjs'

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link href="/">
        <div className="flex items-center gap-2.5 cursor-pointer ">
          <Image src="/images/logo.svg" alt="Logo" width={50} height={146} />
        </div>
      </Link>
      <div className="flex items-center gap-8">
        <Navitems />
        <Show when="signed-out">
          <div className="flex items-center gap-4 btn-signin">
            <SignInButton />
          </div>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    </nav>
  )
}

export default Navbar