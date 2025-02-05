import React from "react";
import HeaderCombine from "./headerCombine";
import ScrollingEffectElement from "./scrollingEffectElements";

export default function HeaderPlusMarquee() {
    return (
        <div>
            {/* Fixed Header */}
            <div style={{ 
                position: "fixed", 
                top: 0, 
                left: 0, 
                width: "100%", 
                zIndex: 1000 
            }}>
                <HeaderCombine />
                <ScrollingEffectElement />
            </div>

          
        </div>
    );
}
