const Discipline = {
    ComputerScience: "ComputerScience",
    Nursing: "Nursing",
    ElectricalEngineering: "ElectricalEngineering",
    MechanicalEngineering: "MechanicalEngineering",
    BusinessAdministration: "BusinessAdministration"
}

const School = {
    CVM: "Cégep du Vieux Montréal",
    CAL: "Cégep André-Laurendeau",
    DC: "Dawson College",
    CEM: "Cégep Édouard-Montpetit",
    CSM: "Cégep de Saint-Laurent",
}

export const COMMON_INPUTS=[
    {id: 1, label: 'register.inputs.firstName.label', type: "text", placeholder: 'register.inputs.firstName.placeholder', name: "firstName"},
    {id: 2, label: 'register.inputs.lastName.label', type: "text", placeholder: 'register.inputs.lastName.placeholder', name: "lastName"},
    {id: 3, label: 'register.inputs.email.label', type: "email", placeholder: 'register.inputs.email.placeholder', name: "email"},
    {id: 4, label: 'register.inputs.password.label', type: "password", placeholder: "••••••••", name: "password"},
    {id: 5, label: 'register.inputs.confirmPassword.label', type: "password", placeholder: "••••••••", name: "passwordConfirmation"}
]

export const ROLE_CONFIG={
    student:{
        endpoint: '/register/student',
        extraInputs:[
            {id: 6, label: 'register.inputs.discipline.label', type: "select", placeholder: 'register.inputs.discipline.placeholder', name: "discipline", optionKeys: Object.values(Discipline)},
        ]
    },
    teacher:{
        endpoint: '/register/teacher',
        extraInputs:[
            {id: 6, label: 'register.inputs.school.label', type: "select", placeholder: 'register.inputs.school.placeholder', name: "school", optionKeys: Object.values(School)},
            {id: 7, label: 'register.inputs.discipline.label', type: "select", placeholder: 'register.inputs.discipline.placeholder', name: "discipline", optionKeys: Object.values(Discipline)},
        ]
    },
    employer:{
        endpoint: '/register/employer',
        extraInputs:[
            {id: 6, label: 'register.inputs.companyName.label', type: "text", placeholder: 'register.inputs.companyName.placeholder', name: "companyName"},
            {id: 7, label: 'register.inputs.city.label', type: "text", placeholder: 'register.inputs.city.placeholder', name: "city"},
        ]
    }
}