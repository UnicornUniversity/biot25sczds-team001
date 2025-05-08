// src/lib/messages.js

const msgs = {
  buildings: {
    fetch: 'Načítám seznam budov…',
    fetchSuccess: 'Seznam budov načten.',
    fetchError: 'Nepodařilo se načíst seznam budov: {error}',

    create: 'Vytvářím novou budovu…',
    createSuccess: 'Budova byla úspěšně vytvořena.',
    createError: 'Nepodařilo se vytvořit budovu: {error}',

    update: 'Ukládám změny budovy…',
    updateSuccess: 'Změny budovy byly uloženy.',
    updateError: 'Nepodařilo se uložit změny budovy: {error}',

    delete: 'Mažu budovu…',
    deleteSuccess: 'Budova byla smazána.',
    deleteError: 'Nepodařilo se smazat budovu: {error}',

    fetchLogs: 'Načítám logy budovy…',
    fetchLogsSuccess: 'Logy budovy načteny.',
    fetchLogsError: 'Nepodařilo se načíst logy budovy: {error}',
  },

  gateways: {
    fetch: 'Načítám seznam gateway zařízení…',
    fetchSuccess: 'Seznam gateway zařízení načten.',
    fetchError: 'Nepodařilo se načíst seznam gateway zařízení: {error}',

    create: 'Vytvářím novou gateway…',
    createSuccess: 'Gateway byla přidána.',
    createError: 'Nepodařilo se přidat gateway: {error}',

    update: 'Ukládám změny gateway…',
    updateSuccess: 'Změny gateway byly uloženy.',
    updateError: 'Nepodařilo se uložit změny gateway: {error}',

    delete: 'Mažu gateway…',
    deleteSuccess: 'Gateway byla smazána.',
    deleteError: 'Nepodařilo se smazat gateway: {error}',
  },

  devices: {
    // Pending/fetch messages for controllers
    fetch: 'Načítám seznam controllerů…',
    fetchSuccess: 'Seznam controllerů načten.',
    fetchError: 'Nepodařilo se načíst seznam controllerů: {error}',

    create: 'Vytvářím nový controller…',
    createSuccess: 'Controller byl přidán.',
    createError: 'Nepodařilo se přidat controller: {error}',

    update: 'Ukládám změny controlleru…',
    updateSuccess: 'Změny controlleru byly uloženy.',
    updateError: 'Nepodařilo se uložit změny controlleru: {error}',

    delete: 'Mažu controller…',
    deleteSuccess: 'Controller byl smazán.',
    deleteError: 'Nepodařilo se smazat controller: {error}',
  },

  doors: {
    fetch: 'Načítám seznam dveří…',
    fetchSuccess: 'Seznam dveří načten.',
    fetchError: 'Nepodařilo se načíst seznam dveří: {error}',

    create: 'Vytvářím nové dveře…',
    createSuccess: 'Dveře byly přidány.',
    createError: 'Nepodařilo se přidat dveře: {error}',

    update: 'Ukládám změny dveří…',
    updateSuccess: 'Změny dveří byly uloženy.',
    updateError: 'Nepodařilo se uložit změny dveří: {error}',

    delete: 'Mažu dveře…',
    deleteSuccess: 'Dveře byly smazány.',
    deleteError: 'Nepodařilo se smazat dveře: {error}',

    fetchLogs: 'Načítám logy dveří…',
    fetchLogsSuccess: 'Logy dveří načteny.',
    fetchLogsError: 'Nepodařilo se načíst logy dveří: {error}',

    toggleLock: 'Měním stav zámku dveří…',
    toggleLockSuccess: 'Stav zámku dveří změněn.',
    toggleLockError: 'Nepodařilo se změnit stav zámku dveří: {error}',

    toggleFavourite: 'Aktualizuji oblíbené dveře…',
    toggleFavouriteSuccess: 'Oblíbené dveře byly aktualizovány.',
    toggleFavouriteError: 'Nepodařilo se aktualizovat oblíbené dveře: {error}',

    // ** nové pro změnu stavu **
    toggleState: 'Měním stav dveří…',
    toggleStateSuccess: 'Stav dveří změněn.',
    toggleStateError: 'Nepodařilo se změnit stav dveří: {error}',
  },

  auth: {
    login: 'Přihlašování uživatele…',
    loginSuccess: 'Přihlášení proběhlo úspěšně.',
    loginError: 'Nepodařilo se přihlásit: {error}',

    register: 'Registrace nového uživatele…',
    registerSuccess: 'Registrace proběhla úspěšně.',
    registerError: 'Nepodařilo se zaregistrovat: {error}',

    logout: 'Odhlašuji uživatele…',
    logoutSuccess: 'Uživatel byl odhlášen.',
    logoutError: 'Nepodařilo se odhlásit: {error}',
  },

  homeLogs: {
    fetch: 'Načítám poslední incidenty…',
    fetchSuccess: 'Poslední incidenty načteny.',
    fetchError: 'Nepodařilo se načíst poslední incidenty: {error}',
  },

  generic: {
    success: 'Hotovo!',
    error: 'Něco se pokazilo :(',
  },

  homeDoors: {
    fetch: 'Načítám stavy dveří…',
    fetchSuccess: 'Stavy dveří načteny.',
    fetchError: 'Nepodařilo se načíst stavy dveří: {error}',
  },
};

export default msgs;
