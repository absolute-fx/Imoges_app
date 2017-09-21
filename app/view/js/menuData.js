const menuItems = [
    {'label': 'Dashboard', 'page': 'dashboard'},
    {'label': 'Parc', 'children': [
        {'label': 'Projets', 'page': 'projects'},
        {'label': 'Biens', 'page': 'realty'},
        {'type' : 'separator'},
        {'label': 'Bibliothèque', 'page': 'library'}
    ]},
    {'label' : 'Clients', 'children': [
        {'label': 'Ajouter un client', 'page': 'clientAdd'},
        {'label': 'Listing clients', 'page': 'clientsList'}
    ]},
    {'label': 'Comptabilité', 'children': [
        {'label': 'Devis', 'page': 'quotes'},
        {'label': 'Factures', 'page': 'invoices'},
        {'label': 'Notes de crédit', 'page': 'creditNotes'},
        {'label': 'Suppléments', 'page': 'sup'}
    ]},
    {'label': 'Partenaires', 'page': 'partners'},
    {'label': 'Site web', 'children': [
        {'label': 'Voir le site', 'type': 'goToSite'},
        {'label': 'Paramètres', 'page': 'websiteParams'},
        {'type' : 'separator'},
        {'label': 'A propos', 'page': 'about'},
        {'label': 'Charte de qualité', 'page': 'qualityChart'},
        {'label': 'Actualités', 'page': 'actualities'},
        {'label': 'F.A.Q.', 'page': 'faq'},
        {'type' : 'separator'},
        {'label': 'Utilisateurs', 'page': 'websiteUsers'},
    ]},
    {'label': 'Aide', 'children': [
        {'type': 'version', 'enabled': false},
        {'label' : 'Contacter le support', 'type': 'afxLabSupport'},
        {'label': 'Debug', 'role': 'toggledevtools'}
    ]},
    {'label': 'Quitter', 'role': 'quit'}
];

module.exports.menuItems = menuItems;