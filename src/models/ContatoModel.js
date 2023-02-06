const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
    idUser: { type: String, required: true },
    nome: { type: String, required: true },
    sobrenome: { type: String, required: false, default: '' },
    email: { type: String, require: false, default: '' },
    telefone: { type: String, require: false, default: '' },
    criadoEm: { type: Date, default: Date.now }
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

class Contato {
    constructor(body, idUser) {
        this.body = body;
        this.idUser = idUser;
        this.errors = [];
        this.contato = null;
    }

    async register() {
        this.valida();
        console.log(this.idUser);
        this.body['idUser'] = this.idUser;
        console.log(this.body);
        if (this.errors.length > 0) return;
        this.contato = await ContatoModel.create(this.body);
    }

    valida() {
        this.cleanUp();
        // E-mail deve ser valido
        if (this.body.email && !validator.isEmail(this.body.email)) {
            this.errors.push('❌ E-mail inválido.');
        }
        // Valida se o NOME foi preenchido
        if (!this.body.nome) this.errors.push('❌ Nome é um campo obrigatório.');

        // Valida se preencheu e-mail ou telefone
        if (!this.body.email && !this.body.telefone) {
            this.errors.push('❌ Informe pelo menos um telefone ou e-mail.');
        }
    }

    cleanUp() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            };
        }

        //Corpo do Request
        this.body = {
            nome: this.body.nome,
            sobrenome: this.body.sobrenome,
            email: this.body.email,
            telefone: this.body.telefone
        };
    }

    async buscaPorId(id) {
        if (typeof id !== 'string') return;
        const user = await ContatoModel.findById(id);
        return user;
    }

    async edit(id) {
        if (typeof id !== 'string') return;
        this.valida();
        if (this.errors.length > 0) return;
        this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });

    }

    // static async buscaContatos(idUser) {
    //     const contatos = await ContatoModel.find({ idUser: idUser })
    static async buscaContatos() {
        const contatos = await ContatoModel.find()
            .sort({ criadoEm: -1 });
        return contatos;
    }

    static async delete(id) {
        if (typeof id !== 'string') return;
        const contato = await ContatoModel.findOneAndDelete({ _id: id });
        return contato;
    }
}

module.exports = Contato;