<?php

return [
    // Canonical role list
    'roles' => [
        'super_admin',
        'admin',
        'hr',
        'approver',
        'supervisor',
        'karyawan',
    ],

    // Role groups used across the app
    'groups' => [
        // Who may edit bobot
        'bobot_edit' => ['super_admin','hr'],
        // Who may perform penilaian CRUD
        'penilaian' => ['super_admin','admin','hr','supervisor'],
    // who may approve penilaian
    'approvals' => ['super_admin','supervisor'],
        // Who may calculate SAW
        'saw_calculate' => ['super_admin','admin','hr'],
        // Who may view admin dashboards and exports
        'view_dashboard' => ['super_admin','admin','hr','supervisor'],
        // Who may export results
        'export' => ['super_admin','admin','hr','supervisor'],
        // Who may manage users
        'manage_users' => ['super_admin'],
    ],
];
