import React from 'react';


export function Slider({value, onChange}) {
    function onNativeChange(event) {
        console.log('onChange', event);
        console.log('value', event.target.value);
        onChange(event.target.value);
    }

    return (
        <div class="slidecontainer">
            <input type="range" min="-5" max="5" value={value} onChange={onNativeChange} class="slider" id="myRange" />
        </div>
    )
}

console.log('loaded shim code');