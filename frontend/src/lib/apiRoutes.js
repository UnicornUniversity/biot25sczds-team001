/*
  Static definition of all backend API routes for the frontend
  Usage:
    import { API_ROUTES } from './apiRoutes';
    fetch(`${BASE_URL}${API_ROUTES.buildings.get(id)}`);
*/

export const API_ROUTES = {
    auth: {
      register: '/register',
      login: '/login'
    },
  
    test: {
      authCheck: '/testauth'
    },
  
    buildings: {
        list:   (page = 1, pageSize = 10) =>
          `/buildings?page=${page}&pageSize=${pageSize}`,
        get:    id  => `/buildings/${id}`,
        create:     '/buildings',
        update: id  => `/buildings/${id}`,
        delete: id  => `/buildings/${id}`,
        logs: (buildingId, page = 1, pageSize = 10, severity = '') => {
            let q = `?page=${page}&pageSize=${pageSize}`;
            if (severity) q += `&severity=${severity}`;
            return `/logs/building/${buildingId}${q}`;
          },
      },
  
      doors: {
        listByBuilding: (buildingId, page = 1, pageSize = 10) =>
          `/buildings/${buildingId}/doors?page=${page}&pageSize=${pageSize}`,
        favourites:    '/doors/favourites', 
        status:          '/doors/status',  
        get:               id     => `/doors/${id}`,
        create:                  '/doors',
        update:            id     => `/doors/${id}`,
        delete:            id     => `/doors/${id}`,
        toggleState:       id     => `/doors/${id}/toggle-state`,
        toggleLock:        id     => `/doors/${id}/toggle-lock`,
        toggleFavourite:   id     => `/doors/${id}/toggle-favourite`,
        logs:            (id, limit = 10, offset = 0) =>
          `/doors/${id}/logs?limit=${limit}&offset=${offset}`,
      },
  

      gateways: {
        // stránkované filtrování
        list: (opts = {}) => {
          const { page=1, pageSize=10, ownerId, buildingId, created } = opts;
          let q = `?page=${page}&pageSize=${pageSize}`;
          if (ownerId)    q += `&ownerId=${ownerId}`;
          if (buildingId) q += `&buildingId=${buildingId}`;
          if (created !== undefined) q += `&created=${created}`;
          return `/gateways${q}`;
        },
        templates: '/gateways/templates',
        available: '/gateways/available-gateways',
        attach:    id => `/gateways/${id}`,       // PUT sets created=true
        detach:    id => `/gateways/${id}`,       // DELETE flips created=false
        update:    id => `/gateways/${id}`,
        delete:    id => `/gateways/${id}`,       // admin hard-delete
      },
    
      devices: {
        list:      (opts = {}) => {
          const { page=1, pageSize=10, doorId, gatewayId, created } = opts;
          let q = `?page=${page}&pageSize=${pageSize}`;
          if (doorId)    q += `&doorId=${doorId}`;
          if (gatewayId) q += `&gatewayId=${gatewayId}`;
          if (created !== undefined) q += `&created=${created}`;
          return `/devices${q}`;
        },
        get:        id => `/devices/${id}`,
        update:     id => `/devices/${id}`,          // PUT => edit or attach (created=true,doorId)
        delete:     id => `/devices/${id}`,          // DELETE => detach (created=false,doorId=null)
        templates:  '/devices/templates',            // query ?gatewayId=
        available:  '/devices/available-controllers',// query ?gatewayId=
      },
  
      logs: {
        list: (options = {}) => {
          const { page = 1, pageSize = 10, relatedDoor = '', severity = '' } = options;
          let qs = `?page=${page}&pageSize=${pageSize}`;
          if (relatedDoor) qs += `&relatedDoor=${relatedDoor}`;
          if (severity)    qs += `&severity=${severity}`;
          return `/logs${qs}`;
        },
        create: '/log/create',
        listByUser: (ownerId, page = 1, pageSize = 10, severity = '') => {
          let qs = `?page=${page}&pageSize=${pageSize}`;
          if (severity) qs += `&severity=${severity}`;
          return `/logs/user${qs}`;  // ownerId is inferred from token on backend
        },
      },
    };