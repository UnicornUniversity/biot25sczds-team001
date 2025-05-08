'use client';

import React from 'react';
import Building          from './Building';
import BuildingAddButton from './BuildingAddButton';
import cls               from './BuildingsList.module.css';

export default function BuildingsList({
  buildings,
  onAdd,
  onEdit,
  onLogs,
  pageInfo,
  nextPage,
  prevPage
}) {
  return (
    <section className={cls.wrapper}>
      <div className={cls.head}>
        <BuildingAddButton onClick={onAdd} />
      </div>

      <ul className={cls.grid}>
        {buildings.map(b => (
          <Building
            key={b._id}
            building={b}
            onEdit={() => onEdit(b)}
            onLogs={() => onLogs(b)}
          />
        ))}
      </ul>

      <div className={cls.pagination}>
        <button
          onClick={prevPage}
          disabled={pageInfo.page === 1}
          className={cls.pageBtn}
        >
          ‹ Předchozí
        </button>
        <span className={cls.pageInfo}>
          Strana {pageInfo.page} z {pageInfo.totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={pageInfo.page === pageInfo.totalPages}
          className={cls.pageBtn}
        >
          Další ›
        </button>
      </div>
    </section>
  );
}