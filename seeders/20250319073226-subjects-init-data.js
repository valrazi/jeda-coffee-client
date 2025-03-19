'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('subjects', [
    {
      title: 'FAT Rusak'
    },
    {
      title: 'FAT Terbuka'
    },
    {
      title: 'Kabel Distribusi Kendor'
    },
    {
      title: 'Kabel Feeder Kendor'
    },
    {
      title: 'Pemindahan Tiang'
    },
    {
      title: 'Pemindahan Pedestal'
    }
   ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
