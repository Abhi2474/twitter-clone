import React, { ReactNode } from 'react'

type IconHoverEffectProps = {
	children: ReactNode	
	red? :boolean
}

export const IconHoverEffect = ({children, red= false}: IconHoverEffectProps) => {
	const colorClasses = red ? ' outline-red-500 hover:bg-red-200 group-hover-bg-red-200 group-focusvisible:bg-red-200' : "outline-gray-500 hover:bg-gray-200 group-hover-bg-gray-200 group-focusvisible:bg-gray-200"

  return (
	<div className={`rounded-full p-2 transition-colors duration-200 ${colorClasses}`}>{children}</div>
  )
}
