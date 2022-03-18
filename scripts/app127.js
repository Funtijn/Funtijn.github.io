const odooUsernameTextbox = $('#placeholderOdooUsername').dxTextBox({
    placeholder: 'Geef je Odoo gebruikersnaam op, bvb John Smith => jsmith',
});

const odooPasswordTextbox = $('#placeholderOdooPassword').dxTextBox({
    placeholder: 'Geef je Odoo paswoord op',
});

$(function () {
    $("#button3").dxButton({
        stylingMode: "outlined",
        text: "Kleur volgens status",
        type: "success",
        onClick: async function () {
            $.ajax({
                type: "POST",
                url: 'https://192.168.1.183/api/authenticate',
                data: {
                    db: 'uat_20220202',
                    login: 'mhemeryck',
                    password: 'ypSRA63r',
                },
                success: function (data) {
                    var text = data.token;
                    DevExpress.ui.notify(text);
                }
            });
            //test
            //await fetchAsync();
        },
    });
});

function auth() {
    $.ajax({
        type: "POST",
        url: 'https://192.168.1.183/api/authenticate',
        data: {
            db: 'uat_20220202',
            login: 'mhemeryck',
            password: 'ypSRA63r',
        },
        success: function (data) {
            var text = data.token;
        }
    });
}

//async function fetchAsync() {
//    let response = await fetch("https://192.168.1.183:443/api/authenticate", {
//        method: 'POST',
//        origin: '*',
//        db: 'uat_20220202',
//        login: 'mhemeryck',
//        password: 'ypSRA63r',
//    });
//    let data = await response.json();
//    DevExpress.ui.notify(data.token);
//    return data;
//}