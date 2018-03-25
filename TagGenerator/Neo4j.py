from neo4j.v1 import GraphDatabase

uri = "bolt://localhost:7687"
driver = GraphDatabase.driver(uri, auth=("neo4j", "password"))

def add_hobby_to_graph_db(Name):
    with driver.session() as session:
        with session.begin_transaction() as tx:
            #tx.run("CREATE(a:Hobby {name:{Name}}) RETURN a", Name= Name)
            tx.run("CREATE(a:Activity {name:{Name}}) RETURN a", Name= Name)



def add_tag_to_graph_db(Name):
    with driver.session() as session:
        with session.begin_transaction() as tx:
            tx.run("CREATE(a:Tag {name:{Name}}) RETURN a", Name= Name)


def add_relationship_to_graph_db(Name, tagName):
    with driver.session() as session:
        with session.begin_transaction() as tx:
            tx.run("MATCH(a:Activity {name:{Name}}), (b:Tag {name:{tagName}}) MERGE (a)-[r:has]->(b)", Name= Name, tagName = tagName)


add_relationship_to_graph_db("Brock Lesnar", "")
