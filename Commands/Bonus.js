const Discord = require("discord.js");
const Database = require("../Helpers/Database");
// exports.onLoad = (client) => {};
/**
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array<String>} args 
 */
exports.run = async (client, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR") && !message.member.hasPermission("MANAGE_GUILD")) return message.reply("Vous n'avez pas la permission pour utiliser cette commande !");

    var victim = message.mentions.members.size > 0 ? message.mentions.members.first().id : args.length > 0 ? args[0] : undefined;
    if(!victim) return message.reply("Vous n'avez pas mentionner de membre");
    victim = message.guild.member(victim);
    if(!victim) return message.reply("Le membre que vous mentionnez doit être dans le serveur");

    var num = Number(args[1]);
    if(isNaN(num)) return message.reply("Veuillez choisir un nombre valide");
    const db = new Database("./Servers/" + message.guild.id, "Invites");

    var bonus = (db.add(`invites.${victim.id}.bonus`, num) || 0), total = (db.get(`invites.${victim.id}.total`) || 0);
    message.reply(`${num} bonuses were successfully added to ${victim}.`);

    global.onUpdateInvite(victim, message.guild.id, total + bonus);
};

exports.conf = {
    commands: ["bonus"],
    usage: "[p]bonus <member> <value>",
    enabled: true,
    guildOnly: true
};
