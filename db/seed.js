require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, User, Ticket, Comment } = require('../models');

const seed = async () => {
  await sequelize.sync({ force: true });

  const hash = (pwd) => bcrypt.hashSync(pwd, 10);

  const [manager1, manager2, collab1, collab2, support1] = await User.bulkCreate([
    { name: 'Alice Martin',  email: 'alice@example.com',  password: hash('password1'), role: 'manager' },
    { name: 'John Doe',    email: 'john@example.com',    password: hash('securePassword123'), role: 'manager' },
    { name: 'Clara Petit',   email: 'clara@example.com',  password: hash('password3'), role: 'collaborateur' },
    { name: 'David Morel',   email: 'david@example.com',  password: hash('password4'), role: 'collaborateur' },
    { name: 'Eva Leroy',     email: 'eva@example.com',    password: hash('password5'), role: 'support' },
  ]);

  await collab1.update({ manager_id: manager1.id });
  await collab2.update({ manager_id: manager1.id });
  await support1.update({ manager_id: manager2.id });

  const [t1, t2, t3, t4, t5] = await Ticket.bulkCreate([
    {
      title: 'Impossible de se connecter au VPN',
      description: 'Le client VPN refuse ma connexion depuis ce matin.',
      category: 'access',
      priority: 'high',
      status: 'open',
      author_id: collab1.id,
    },
    {
      title: 'Écran noir au démarrage',
      description: "L'ordinateur démarre mais l'écran reste noir.",
      category: 'materiel',
      priority: 'critical',
      status: 'assigned',
      author_id: collab2.id,
      assigned_to: support1.id,
    },
    {
      title: 'Bug sur le formulaire de commande',
      description: 'La validation du formulaire plante avec des caractères spéciaux.',
      category: 'bug',
      priority: 'medium',
      status: 'in_progress',
      author_id: collab1.id,
      assigned_to: support1.id,
    },
    {
      title: 'Demande accès dossier partagé RH',
      description: "Besoin d'accéder au partage réseau \\\\srv01\\RH pour mon nouveau poste.",
      category: 'access',
      priority: 'low',
      status: 'resolved',
      author_id: collab2.id,
      assigned_to: support1.id,
    },
    {
      title: 'Imprimante hors service salle B12',
      description: "L'imprimante HP LaserJet affiche une erreur papier en permanence.",
      category: 'materiel',
      priority: 'medium',
      status: 'open',
      author_id: collab1.id,
    },
  ]);

  await Comment.bulkCreate([
    {
      content: 'Avez-vous essayé de réinstaller le client VPN ?',
      is_internal: false,
      ticket_id: t1.id,
      author_id: support1.id,
    },
    {
      content: "J'ai essayé, le problème persiste.",
      is_internal: false,
      ticket_id: t1.id,
      author_id: collab1.id,
    },
    {
      content: 'Problème identifié : câble DisplayPort défectueux, commande en cours.',
      is_internal: true,
      ticket_id: t2.id,
      author_id: support1.id,
    },
    {
      content: 'Le bug est reproductible avec les caractères < > & uniquement.',
      is_internal: false,
      ticket_id: t3.id,
      author_id: collab1.id,
    },
    {
      content: "Accès accordé, merci de vérifier que vous pouvez vous connecter.",
      is_internal: false,
      ticket_id: t4.id,
      author_id: support1.id,
    },
  ]);

  console.log('Seed completed successfully.');
  console.log(`  Users   : ${await User.count()}`);
  console.log(`  Tickets : ${await Ticket.count()}`);
  console.log(`  Comments: ${await Comment.count()}`);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

module.exports = seed;
