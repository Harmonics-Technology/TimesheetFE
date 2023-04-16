import * as React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

const DragDropContext = (WrappedComponent) => (props) => {
    return (
        <DndProvider backend={HTML5Backend}>
            <WrappedComponent {...props} />
        </DndProvider>
    );
};

export default DragDropContext;
