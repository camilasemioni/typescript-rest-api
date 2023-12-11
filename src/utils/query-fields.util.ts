import BadRequestError from '../errors/bad-request.error';

export const fieldNames = [
    '',
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

export const validateQueries = (queries: string | string[]) => {
    let queryList: string[] = [];

    if (typeof queries === 'string') {
        queryList = queries.split(',');
    } else if (Array.isArray(queries)) {
        queryList = queries as string[];
    }
    if (
        !queryList.every((query: string) =>
            fieldNames.includes(query),
        )
    ) {
        throw new BadRequestError('Invalid query');
    } else if (
        queryList.map((query): void => {
            if (queryList.includes(`-${query}`)) {
                throw new BadRequestError('Invalid query');
            }
            return;
        })
    )
        return queryList.join(' ');
};
