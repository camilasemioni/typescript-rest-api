import Joi from 'joi';
import JoiDate from '@joi/date';

const DateJoi = Joi.extend(JoiDate);

export const createCustomerSchemaValidation = Joi.object({
    name: Joi.string()
        .trim(true)
        .pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ '-]{3,50}$/)
        .messages({
            'string.pattern.base': `The name provided, '{#value}', is not valid. Please provide a valid name. (Joi)`,
        })
        .required(),

    cpf: Joi.string()
        .trim(true)
        .pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
        .messages({
            'string.pattern.base': `The CPF provided, '{#value}', is not valid. Please provide a valid CPF. (Joi)`,
        })
        .required(),

    password: Joi.string()
        .trim(true)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,50}$/)
        .messages({
            'string.pattern.base': `The password provided, '{#value}', is not valid. Password must be a minimum of 6 characters, including at least one uppercase letter, one lowercase letter, and one digit. (Joi)`,
        })
        .required(),

    birthday: DateJoi.date().format(['DD/MM/YYYY']).required(),

    email: Joi.string().trim(true).email().required(),

    cep: Joi.string()
        .trim(true)
        .pattern(/^\d{5}-\d{3}$/)
        .messages({
            'string.pattern.base': `The CEP provided, '{#value}', is not valid. Please provide a valid CEP. (Joi)`,
        })
        .required(),

    number: Joi.string()
        .trim(true)
        .pattern(/^[0-9]{1,6}[A-Za-z]{0,3}?$/)
        .messages({
            'string.pattern.base': `The number provided, '{#value}', is not valid. Please provide a valid number. (Joi)`,
        })
        .required(),
});

export const updateCustomerSchemaValitation = Joi.object({
    name: Joi.string()
        .trim(true)
        .pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ '-]{3,50}$/)
        .messages({
            'string.pattern.base': `The name provided, '{#value}', is not valid. Please provide a valid name. (Joi)`,
        }),

    cpf: Joi.string()
        .trim(true)
        .pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
        .messages({
            'string.pattern.base': `The CPF provided, '{#value}', is not valid. Please provide a valid CPF. (Joi)`,
        }),

    password: Joi.string()
        .trim(true)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,50}$/)
        .messages({
            'string.pattern.base': `The password provided, '{#value}', is not valid. Password must be a minimum of 6 characters, including at least one uppercase letter, one lowercase letter, and one digit. (Joi)`,
        }),

    birthday: DateJoi.date().format(['DD/MM/YYYY']),

    email: Joi.string().trim(true).email(),

    cep: Joi.string()
        .trim(true)
        .pattern(/^\d{5}-\d{3}$/)
        .messages({
            'string.pattern.base': `The CEP provided, '{#value}', is not valid. Please provide a valid CEP. (Joi)`,
        }),

    number: Joi.string()
        .trim(true)
        .pattern(/^[0-9]{1,6}[A-Za-z]{0,3}?$/)
        .messages({
            'string.pattern.base': `The number provided, '{#value}', is not valid. Please provide a valid number. (Joi)`,
        }),
});
