import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/** generate new array within itemToDelete */
export const deleteItemByIdFromArray = (itemToDelete, array) => {
    return array.filter( item => item.id !== itemToDelete.id );
}
/** custom hook for save previus state */
const usePrevious = (value) => {
    const ref = useRef();

    useEffect(() => {
        ref.current = value;
    });

    return ref.current;
}

const generateHash = () => new Date().getTime();

const TextManager = ( { initialState = [] } ) => {

    const [optionsList, setOptionsList] = useState(initialState);

    const prevState = usePrevious( optionsList );

    const addOptionByTextProp = () => {
        const text = window.prompt('Agrega un nuevo texto');
        if( text !== "" && text !== null ) {
            const id = `${text}-${generateHash()}`;
            setOptionsList( [ ...optionsList, { id, text, selected : false } ] );
        }
    }

    const deleteItemDoubleClick = event => {
        const newOptionsList = deleteItemByIdFromArray( event.target, optionsList );
        setOptionsList( newOptionsList );
    }

    const deleteOptionsBySelection = () => {
        const selectMultiple = document.getElementById( 'TextListSelect' );
        const arrayOptionsForDelete = [];

        for(let i = selectMultiple.options.length-1; i >= 0; i--) {
            if( selectMultiple.options[i].selected ) {
                arrayOptionsForDelete.push( selectMultiple.options[i] );
            }
        }
        /** Create array aux for not redering virual dom multiple times  */
        let arrayOptionsAux = optionsList;
        if( arrayOptionsForDelete.length > 0 ) {
            arrayOptionsForDelete.forEach( ( option ) => {
                const newOptionsListAux = deleteItemByIdFromArray(option, arrayOptionsAux);
                arrayOptionsAux = newOptionsListAux;
            });

            /** Save new array optionList */
            setOptionsList( arrayOptionsAux );
        }
    }

    const undoLastChange = () => setOptionsList( prevState );

    const generateOptionsList = () => {
        if( optionsList.length > 0 ) {
            return optionsList.map( ( { id, text } ) => {
                return <option data-testid="option_selectable" onDoubleClick={deleteItemDoubleClick} id={id} key={id} value={text}> {text} </option>
            })
        }

        return <option data-testid="option_disabled" id="option_disabled" value="disabled" disabled > Agrega un nuevo elemento </option>;
    }

    return (
        <div className="text-manager">
            <div className="text-manager--select">
                <select data-testid="select" name="TextListSelect" id="TextListSelect" multiple>
                    { generateOptionsList() }
                </select>
            </div>
            <div className="text-manager--buttons">
                <button data-testid="button-add" onClick={addOptionByTextProp}>+ Añadir option</button>
                <button data-testid="button-remove" onClick={deleteOptionsBySelection}>- Eliminar seleccionados</button>
                <button data-testid="button-undo" onClick={undoLastChange} disabled={prevState === undefined}>Deshacer último cambio</button>
            </div>
        </div>
    );
}

TextManager.propTypes = {
    initialState: PropTypes.array,
}

export default TextManager;