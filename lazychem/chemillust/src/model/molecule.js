export function createMolecule() {
  return {
    atoms: [],
    bonds: [],
    nextAtomId: 1,
    nextBondId: 1,
  };
};

export function addAtom(molecule, element, x, y) {
  const atom = {
    id: molecule.nextAtomId++,
    element,
    x,
    y,
  };

  molecule.atoms.push(atom);

  // return atom;
};

export function addBond(molecule, atom1Id, atom2Id, order = 1) {
  if (atom1Id === atom2Id) {
    return null;
  };

  const bond = {
    id: molecule.nextBondId++,
    a1: atom1Id,
    a2: atom2Id,
    order,
  };

  molecule.bonds.push(bond);

  // return bond;
};

export function removeAtom(molecule, atomId) {
  molecule.atoms = molecule.atoms.filter(atom => {
    atom.id !== atomId;
  });

  molecule.bonds = molecule.bonds.filter(bond => {
    bond.a1 !== atomId && 
    bond.a2 !== atomId;
  });
};

export function removeBond(molecule, bondId) {
  molecule.bonds = molecule.bonds.filter(bond => {
    bond.id !== bondId;
  });
};