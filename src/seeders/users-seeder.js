'use strict';

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'admin@admin.com',
      password: '$2a$10$9JzvfeV2OGy8EAaf/SGlZ.2XNZqEoXKUQrhgeVWc330LmIeZ32/sy', // 123456,
      firstName: 'Augustus',
      lastName: 'Flynn',
      address: "Ha Noi",
      gender: 1,
      keyRole: "R1",
      typeRole:"ROLE",
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
