import React, { useEffect, useState } from "react";
import useWindow from "./useWindow";

interface IuseClassWidths {
    width: number | string,
    classList: string | string[]
}

interface IuseClass {
    cls: string;
    type?: string;
    variant?: string;
    extras?: string[] | undefined;
    minWidths?: IuseClassWidths[];
    maxWidths?: IuseClassWidths[];
}

const useClass = (props: IuseClass) => {
    const { cls, type, variant, extras, minWidths, maxWidths } = props;
    const [classState, setClassState] = useState<string>(cls);
    const { width: windowWidth } = useWindow();

    useEffect(() => {
        let newClass = cls;
        
        // Function to append modifiers
        const appendModifier = (modifier: string | undefined) => {
            if (modifier) {
                newClass += ` ${cls}__${modifier}`;
            }
        };
        
        appendModifier(variant);
        appendModifier(type);
        
        if (extras) {
            extras.forEach(extra => {
                if (extra?.length) {
                    newClass += ` ${cls}__${extra}`;
                }
            });
        }

        const handleWidths = (widths: IuseClassWidths[], isMinWidth: boolean) => {
            widths.forEach(w => {
                const widthCondition = typeof w.width === 'number' ? w.width :
                    (typeof w.width === 'string' && w.width.endsWith('px') ? parseInt(w.width) : 0);
                
                if (isMinWidth ? widthCondition > windowWidth : widthCondition < windowWidth) {
                    if (Array.isArray(w.classList)) {
                        w.classList.forEach(c => {
                            newClass += ` ${cls}__${c}`;
                        });
                    } else {
                        newClass += ` ${cls}${w.classList}`;
                    }
                }
            });
        };
        
        if (minWidths) {
            handleWidths(minWidths, true);
        }
        
        if (maxWidths) {
            handleWidths(maxWidths, false);
        }

        setClassState(newClass);
    }, [cls, type, variant, extras, minWidths, maxWidths, windowWidth]);

    return classState;
};

export default useClass;
