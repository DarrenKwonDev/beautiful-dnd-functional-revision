import React, { useState } from "react";
import initialData from "./initial-data";
import Column from "./column";
import { DragDropContext } from "react-beautiful-dnd";

function App() {
  const [state, setstate] = useState(() => initialData);

  const onDragEnd = (result) => {
    // destination이 끝 위치, source가 시작 위치를 의미함
    const { destination, source, draggableId } = result;

    // dnd를 도중에 멈췄으므로(올바른 droppable 위에 두지 않았으므로) 그냥 리턴
    if (!destination) {
      return;
    }

    // 같은 자리에 가져다 두었다면 그냥 리턴
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // 시작한 source의 droppable 위치
    const column = state.columns[source.droppableId];

    // 새로이 만들어진 해당 컬럼의 task를 array 형태로 반환
    const newTaskIds = Array.from(column.taskIds);

    // 해당 array를 splic해서 새로 넣는 작업
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);

    // 새로운 컬럼
    const newColumn = {
      ...column,
      taskIds: newTaskIds,
    };

    // 기존 state와 새롭게 바뀐 정보를 넣어 새 state로 만듦
    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newColumn.id]: newColumn,
      },
    };

    setstate(newState);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {state.columnOrder.map((columnId) => {
        const column = state.columns[columnId];
        const tasks = column.taskIds.map((taskId) => state.tasks[taskId]);

        return <Column key={column.id} column={column} tasks={tasks} />;
      })}
    </DragDropContext>
  );
}

export default App;
