import React from 'react'

function PitchName({note}: {note: string}) {
    if (!/\//g.test(note)) {
        return <div className='z-20'>{note}</div>
    }
    const notes = note.replaceAll(/&#9839;|&#9837;/g, '').split(" / ");
    return (
        <div className='grid z-20 grid-cols-1 md:grid-cols-3 text-center'><span>{notes[0]}&#9839;</span> <span className='hidden md:inline-block'>/</span> <span>{notes[1]}&#9837;</span></div>
    )
  }

export default PitchName