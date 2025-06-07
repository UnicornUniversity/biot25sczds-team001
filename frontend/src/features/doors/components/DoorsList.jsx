'use client';

import Door from './Door';
import DoorAddButton from './DoorAddButton';
import cls from './DoorsList.module.css';

export default function DoorsList({
  doors,
  userFavs,
  showAdd = true,
  onAdd,
  onEdit,
  onLogs,
  onToggleFav,
  onToggleLock,
  onChangeState,
  pageInfo,
  nextPage,
  prevPage,
}) {
  return (
    <section className={cls.wrapper}>
      <div className={cls.head}>{showAdd && <DoorAddButton onClick={onAdd} />}</div>

      <ul className={cls.list}>
        {doors.map(d => (
          <Door
            key={d._id}
            door={d}
            buildingName={d.buildingName}
            state={d.state}
            isFavourite={userFavs.includes(d._id)}
            onToggleFavourite={() => onToggleFav(d._id)}
            onToggleLock={() => onToggleLock(d._id)}
            onChangeState={onChangeState}
            onEdit={() => onEdit(d)}
            onLogs={() => onLogs(d)}
          />
        ))}
      </ul>

      <div className={cls.pagination}>
        <button className={cls.pageBtn} onClick={prevPage} disabled={pageInfo.page === 1}>
          ‹ Předchozí
        </button>
        <span className={cls.pageInfo}>Strana {pageInfo.page} z {pageInfo.totalPages}</span>
        <button
          className={cls.pageBtn}
          onClick={nextPage}
          disabled={pageInfo.page === pageInfo.totalPages}
        >
          Další ›
        </button>
      </div>
    </section>
  );
}