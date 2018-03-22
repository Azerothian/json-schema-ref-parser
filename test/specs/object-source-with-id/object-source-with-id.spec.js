describe('Object sources with id set for reference', function () {
  'use strict';

  it('should dereference a single object', function () {
    var parser = new $RefParser();
    return parser
      .dereference(helper.cloneDeep(helper.parsed.objectSourceWithIdInternal))
      .then(function (schema) {
        expect(schema).to.equal(parser.schema);
        expect(schema).to.deep.equal(helper.dereferenced.objectSourceWithIdInternal);

        // The schema path should be the current directory
        var expectedPaths = [
          'http://www.example.com/',
        ];
        expect(parser.$refs.paths()).to.have.same.members(expectedPaths);
        expect(parser.$refs.values()).to.have.keys(expectedPaths);

        // Reference equality
        expect(schema.properties.name).to.equal(schema.definitions.name);
        expect(schema.definitions.requiredString)
          .to.equal(schema.definitions.name.properties.first)
          .to.equal(schema.definitions.name.properties.last)
          .to.equal(schema.properties.name.properties.first)
          .to.equal(schema.properties.name.properties.last);
      });
  });

  it('should dereference an object that references external files', function () {
    var parser = new $RefParser();
    return parser
      .dereference(helper.cloneDeep(helper.parsed.objectSourceWithId.schema))
      .then(function (schema) {
        
        expect(schema).to.equal(parser.schema);
        expect(schema).to.deep.equal(helper.dereferenced.objectSourceWithId);
        console.log('AAAAAAAAAAAAAAAAA', { schema: schema, paths: parser.$refs.paths() });
        // The schema path should be the current directory, and all other paths should be absolute
        var expectedPaths = [
          'http://www.example.com/',
          path.abs('1specs/object-source/definitions/definitions.json'),
          path.abs('specs/object-source/definitions/name.yaml'),
          path.abs('specs/object-source/definitions/required-string.yaml')
        ];
        expect(parser.$refs.paths()).to.have.same.members(expectedPaths);
        expect(parser.$refs.values()).to.have.keys(expectedPaths);

        // Reference equality
        expect(schema.properties.name).to.equal(schema.definitions.name);
        expect(schema.definitions.requiredString)
          .to.equal(schema.definitions.name.properties.first)
          .to.equal(schema.definitions.name.properties.last)
          .to.equal(schema.properties.name.properties.first)
          .to.equal(schema.properties.name.properties.last);

        // The "circular" flag should NOT be set
        expect(parser.$refs.circular).to.equal(false);
      });
  });

  // it('should bundle an object that references external files', function () {
  //   var parser = new $RefParser();
  //   return parser
  //     .bundle(helper.cloneDeep(helper.parsed.objectSourceWithIdInternal.schema))
  //     .then(function (schema) {
  //       expect(schema).to.equal(parser.schema);
  //       expect(schema).to.deep.equal(helper.bundled.objectSourceWithIdInternal);

  //       // The schema path should be the current directory, and all other paths should be absolute
  //       var expectedPaths = [
  //         'http://www.example.com/',
  //         path.abs('specs/object-source/definitions/definitions.json'),
  //         path.abs('specs/object-source/definitions/name.yaml'),
  //         path.abs('specs/object-source/definitions/required-string.yaml')
  //       ];
  //       expect(parser.$refs.paths()).to.have.same.members(expectedPaths);
  //       expect(parser.$refs.values()).to.have.keys(expectedPaths);
  //     });
  // });
});
