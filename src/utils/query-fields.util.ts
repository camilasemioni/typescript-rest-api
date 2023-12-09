export const fieldNames = [
    'name',
    'cpf',
    'birthday',
    'email',
    'cep',
    'uf',
    'city',
    'address',
    'number',
    'complement',
    'neighborhood',
    '-name',
    '-cpf',
    '-birthday',
    '-email',
    '-cep',
    '-uf',
    '-city',
    '-address',
    '-number',
    '-complement',
    '-neighborhood',
];
export const caseInsensitiveFieldNames = [
    'name',
    'email',
    'city',
    'address',
    'complement',
    'neighborhood',
    '-name',
    '-email',
    '-city',
    '-address',
    '-complement',
    '-neighborhood',
];

export const allowedQueries = [
    'limit',
    'page',
    'sort',
    'fields',
    ...fieldNames,
];
