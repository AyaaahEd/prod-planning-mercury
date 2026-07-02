# Mercury Flooring — Production Service

Service Java Spring Boot qui remplace le système PHP original de production Mercury Flooring.

## Entity Relationship Diagram

```
                    ┌──────────────┐
                    │  OrderItem   │ (customer order line)
                    │              │
                    │ ● poNumber   │  e.g. IPO_235827
                    │ ● quality    │  e.g. 0700 (Velvet)
                    │ ● quantity   │  e.g. 5 pieces
                    └──────┬───────┘
                           │ attached to (N:M via AttacheOrderItem)
                           ▼
                    ┌──────────────┐
                    │    Form      │ (print layout from Metaboard)
                    │              │
                    │ ● formNumber │  e.g. 230088
                    │ ● size       │  e.g. 1.95m × 0.40m
                    │ ● repetition │  e.g. 12
                    └──────┬───────┘
                           │ has many versions
                           ▼
                    ┌──────────────┐         ┌──────────────┐
                    │ FormVersion  │────────►│   Machine    │
                    │              │ planned │              │
                    │ ● version#   │   on    │ ● Colaris    │
                    │ ● start/end  │         │ ● Cutting    │
                    │ ● steps[]    │         │ ● Sewing     │
                    └──────┬───────┘         │ ● Coating    │
                           │                 │ ● EFI        │
                           │ auto-creates    └──────────────┘
                           ▼
                    ┌──────────────┐
                    │     Job      │ (1 per OrderItem per FormVersion)
                    │              │
                    │ ● jobNumber  │
                    │ ● steps[]    │
                    └──────┬───────┘
                           │ grouped into
                           ▼
                    ┌──────────────┐        ┌──────────────┐
                    │  JobPalette  │───────►│   RollsOut   │
                    │              │produces│              │
                    │ ● palette#   │        │ ● sections[] │
                    │ ● barcode    │        └──────────────┘
                    │ ● PDF        │
                    └──────────────┘

  RollIn (raw material) ◄── synced from INTEX every 10 min
  Error ── records quality issues on any entity
```

## Glossaire

| Terme | Signification | Équivalent Java |
|---|---|---|
| **Aggregate** | Entité principale d'un domaine. Contient les règles métier. | `Domain/*.java` |
| **Command** | Requête pour faire quelque chose : `CreateForm`, `StartJob` | Endpoints REST + Services |
| **Event** | Ce qui s'est passé : `FormCreated`, `JobWasStarted`. Stocké en Postgres. | `Domain/Event/*Events.java` |
| **Process Manager** | Écoute des événements d'un domaine → déclenche des actions dans un autre. | `ProcessManager/*.java` |
| **Projection** | Lit les événements et construit des documents MongoDB. | `Infrastructure/Projector/*.java` |
| **Value Object** | Type immutable : `MachineStep`, `SpeedStrategyType`. Comparé par valeur. | `Domain/ValueObject/*.java` |
| **Form** | Layout d'impression venant de Metaboard. | `Domain/Form.java` |
| **FormVersion** | Plan de production : quelle machine, quand. | `Domain/FormVersion.java` |
| **Job** | Unité de travail : 1 OrderItem + 1 FormVersion. Créé auto. | `Domain/Job.java` |
| **JobPalette** | Lot de jobs imprimés ensemble. Interface opérateurs. | `Domain/JobPalette.java` |
| **RollIn** | Rouleau de matière première (stock INTEX). | `Domain/RollIn.java` |
| **RollsOut** | Rouleau imprimé sorti de l'imprimante. | `Domain/RollsOut.java` |
| **IPO** | Internal Production Order (préfixe `IPO_`). Via INTEX. | Détecté dans `MetaboardSyncService` |
| **IKO** | Internal Customer Order (préfixe `IKO_`). Via INTEX. | Détecté dans `MetaboardSyncService` |
| **PCC / PYM** | Commandes client PrintCloud/PYM. Via Order Service. | Détecté dans `MetaboardSyncService` |
| **Quality Code** | ID du type de produit (0700=Velvet, 0600=Patio, etc.) | `RollSizeCalculator`, `getWorkingDays...` |
| **Border** | Produit avec bord cousu. Affecte workflow + délai. | Champ `border` dans `OrderItem` |
| **Capacity Time** | Minutes qu'un job prend sur une machine. | `Machine.timeCapacity()` |
| **Setup Time** | Temps de préparation machine avant un job. | `MachineSpeedConfig.setupTimeMinutes` |
| **Reprint** | Réproduction d'un article défectueux. Détecté par suffixe `_R`. | `MetaboardSyncService` + `OrderItemController` |
| **Promise Date** | Date de livraison estimée = qualité × jours ouvrés. | `OrderItem.calculatePromiseAvailableDate()` |
| **Soft Delete** | `deleted=true` au lieu de supprimer de la DB. | À implémenter sur `JobPalette` |



## Architecture

```
production-service/      ← Ce service (Java Spring Boot)
mock-metaboard/          ← Script Python pour générer des données de test
metaboard-ftp/           ← Dossier FTP simulé (inbound / processed)
frontend/                ← Interface utilisateur React
docker-compose.yml       ← Infrastructure (Postgres, MongoDB, Kafka)
```

## Équivalent PHP → Java

| PHP original | Java Spring Boot |
|---|---|
| `bin/create_machines.php` | `DataInitializer.java` (auto au démarrage) |
| `bin/create_event_streams.php` | Géré par JPA/Hibernate (`ddl-auto: update`) |
| `config/autoload/pp-workflow.global.php` | `WorkflowConfig.java` |
| `config/autoload/prooph.global.php` | Spring `@EventListener` (auto-wiring) |
| `bin/*_projection.php` (supervisord) | `*Projector.java` (thread Spring interne) |
| `bin/queue_consume*.php` | `KafkaOrderProducer.java` + consumers Kafka |
| `bin/synchro_form_from_metaboard.php` | `MetaboardSyncService.java` (`@Scheduled`) |
| `bin/synchro_roll_in_from_intex.php` | `IntexRollInSyncTask.java` (`@Scheduled`) |
| `bin/fake/metaboard.php` | `mock-metaboard/generate_sample.py` |
| `src/{X}/Domain/{Aggregate}.php` | `Domain/{Aggregate}.java` |
| `src/{X}/ProcessManager/` | `ProcessManager/*.java` |

## Démarrage rapide

### 1. Lancer l'infrastructure
```bash
docker-compose up -d
```
Démarre : **PostgreSQL** (5432), **MongoDB** (27017), **Kafka** (9092)

### 2. Lancer le service
```bash
cd production-service
./mvnw spring-boot:run
```

> Au démarrage, `DataInitializer` crée automatiquement les 6 machines prédéfinies si elles n'existent pas encore (équivalent de `php bin/create_machines.php`).

### 3. Générer des données de test

**Form normal :**
```bash
cd mock-metaboard
python generate_sample.py
```

**Form avec réimpression (reprint `_R1`) :**
```bash
python generate_sample.py --reprint IPO_235827
```

**Form avec qualité Velvet (0700) :**
```bash
python generate_sample.py --quality 0700 --name velvet_test
```

Le script dépose un `.zip` dans `metaboard-ftp/inbound/`.  
Le `MetaboardSyncService` le récupère automatiquement dans les 10 secondes.

## API REST

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/forms` | Liste des forms |
| `GET` | `/api/v1/forms/{id}` | Détail d'un form |
| `GET` | `/api/v1/jobs` | Liste des jobs |
| `GET` | `/api/v1/machines` | Liste des machines |
| `POST` | `/api/v1/order-items/{id}/reprint/request` | Demander une réimpression (→ NEW) |
| `POST` | `/api/v1/order-items/{id}/reprint/push` | Pousser vers Metaboard (→ WAITING_FOR_METABOARD) |

## Codes Qualité → Workflows

| Code | Produit | Workflow |
|---|---|---|
| 0201 | Pearl | Colaris → Cutting |
| 0334 | Country | Colaris → Coating → Cutting |
| 0411 | Globossoft/Jewel | Colaris → Coating → Cutting |
| 0413 | Melody | Colaris → Cutting |
| 0499/0500 | Viva | Colaris → Cutting → Sewing |
| 0600 | Patio | Colaris → Coating → Cutting |
| 0607 | Impact Pro | Colaris → Coating → Cutting |
| 0610 | Level | Colaris → Coating → Cutting |
| 0700/0701 | Velvet | Colaris → Cutting |
| 0705 | Volta | Colaris → Cutting |
| 1001 | Prestige Vilt | Colaris → Coating → Cutting |
| 1002 | Elegance | Colaris → Coating → Cutting |
| Bolt/Beau/Mika/Picnic/Joy | EFI | EFI-printer → Cutting |

## États universels (Step States)

```
WAITING_FOR_MANUFACTURING → IN_PROGRESS → DONE
```

S'applique à : FormVersion, Job, JobPalette, OrderItem.
