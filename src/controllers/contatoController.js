const { async } = require('regenerator-runtime');
const Contato = require('../models/ContatoModel');

exports.index = (req, res) => {
    res.render('contato', { contato: {}, title: 'Agenda | Adicionar contato' });
}

exports.register = async function (req, res) {
    try {
        const contato = new Contato(req.body, req.session.user._id);
        await contato.register();

        if (contato.errors.length > 0) {
            // Gravo os erros no Flash
            req.flash('errors', contato.errors);
            req.session.save(function () {
                return res.redirect('/contato/index');
            });
            return;
        }

        req.flash('success', '✅ Seu contato foi criado com sucesso!');
        req.session.save(function () {
            return res.redirect(`/contato/index/${contato.contato._id}`);
        });

    } catch (e) {
        console.log(e);
        return res.render('404', { title: "Agenda | Erro 404" });
    }
}

exports.editIndex = async function (req, res) {
    if (!req.params.id) return res.render('404', { title: "Agenda | Erro 404" });
    const contatoBusca = new Contato();
    const contato = await contatoBusca.buscaPorId(req.params.id);
    if (!contato) return res.render('404', { title: "Agenda | Erro 404" });

    res.render('contato', { contato, title: 'Agenda | Adicionar contato' });
};

exports.edit = async function (req, res) {
    try {
        if (!req.params.id) return res.render('404', { title: "Agenda | Erro 404" });
        const contato = new Contato(req.body);
        await contato.edit(req.params.id);

        if (contato.errors.length > 0) {
            // Gravo os erros no Flash
            req.flash('errors', contato.errors);
            req.session.save(function () {
                return res.redirect(`/contato/index/${req.params.id}`);
            });
            return;
        }

        req.flash('success', '✅ Seu contato foi editado com sucesso!');
        req.session.save(function () {
            return res.redirect(`/contato/index/${contato.contato._id}`);
        });
    } catch (e) {
        console.log(e);
        return res.render('404', { title: "Agenda | Erro 404" });
    }
}

exports.delete = async function (req, res) {
    if (!req.params.id) return res.render('404', { title: "Agenda | Erro 404" });

    const contato = await Contato.delete(req.params.id);
    if (!contato) return res.render('404', { title: "Agenda | Erro 404" });

    req.flash('success', '✅ Seu contato foi apagado com sucesso!');
    req.session.save(function () {
        return res.redirect('/');
    });
}