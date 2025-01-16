import React from 'react'

function EmptyBlock({flex}: {flex: number}) {
  return (
    <div 
        className='w-full'
        style={{flex: flex}}>
          
    </div>
  )
}

export default EmptyBlock