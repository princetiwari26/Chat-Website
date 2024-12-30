import React from 'react'

function Notification({onClose}) {
  return (
    <div>
        <div>Notification</div>
        <span onClick={onClose}>&times</span>
    </div>
  )
}

export default Notification