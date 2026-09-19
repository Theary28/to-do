import { useEffect, useState } from 'react'

export default function WindowWidth() {
  const [width, setWidth] = useState(() => window.innerWidth)

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    // Cleanup: remove the listener so an unmounted component is never updated
    // and StrictMode's mount/unmount/mount doesn't leave duplicate listeners.
    return () => window.removeEventListener('resize', handleResize)
  }, []) // subscribe once; handleResize reads window directly, so no deps

  return <span className="window-width">Window: {width}px</span>
}
